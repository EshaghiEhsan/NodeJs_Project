const moment=require("moment-jalaali");
const autoBind=require("auto-bind");

class chatController{

    constructor() {
        autoBind(this);
        this.users=[];
    }

    chatForm(req, res, next) {
        res.render('admin/chat/chat')
    }

    chatRoom(req, res, next) {
        const data={
            type:"info",
            title:"چت انلاین",
            text:"به سیستم چت انلاین خوش امدید"
        }
        req.flash("sweetalert",data);
        res.render('admin/chat/chat-room')
    }

    connectToSocket(io){
        io.on("connection",socket=>{
            console.log("socket run");

            socket.on("join",(query,cb)=>{
                if(query.room ===""||!query.room){
                    cb("چنین انجمنی وجود ندارد");
                }else {
                    socket.join(query.room);
                    this.UserRemove(socket.id);
                    this.UserJoin(socket.id,query.user,query.room);
                    io.to(query.room).emit("userList",this.UserList(query.room));
                    socket.emit("userAdd",
                        this.generateMessage("به این انجمن خوش امدید",
                            "Admin"));
                    socket.broadcast.to(query.room).emit("userAdd",this.generateMessage(
                        `کاربر ${query.user} وارد انجمن شد `,"Admin"
                    ));
                    cb();
                }
            })

            socket.on("chat message",msg=>{
               let userInfo=this.GetUser(socket.id);
               if(userInfo){
                   io.to(userInfo.room).emit("chat message",this.generateMessage(
                       msg.message,msg.sender
                   ));
               }
            })

            socket.on("disconnect",()=>{
                let user=this.UserRemove(socket.id);
                if(user){
                    io.to(user.room).emit("userList",this.UserList(user.room));
                    io.to(user.room).emit("chat message",this.generateMessage(`کاربر ${user.name} از انجمن خارج شد `,"Admin"));
                }
            })
        })
    }

    UserJoin(id,name,room){
        let user={id,name,room};
        this.users.push(user);
        return user;
    }

    UserRemove(id){
        let user=this.GetUser(id);
        if(user){
            this.users=this.users.filter(user=>user.id !== id);
        }
        return user;
    }

    UserList(room){
        let users=this.users.filter(user=>user.room===room);
        let userName=users.map(user=>user.name);
        return userName;
    }

    generateMessage(message,sender){
        return{
            message,
            sender,
            createdAt:moment().format("HH:mm"),
        }
    }
    GetUser(id){
        return this.users.filter(user=>user.id===id)[0];
    }

}



module.exports = new chatController();