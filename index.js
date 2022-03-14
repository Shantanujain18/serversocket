const { type } = require('express/lib/response');
const http = require('http');
var queue = require("queue");
const axios  = require("axios");
const { clearInterval } = require('timers');
var q = queue({ results: [] })



const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
      
      connection.sendUTF('Hi this is WebSocket server!');
      // add jobs using the familiar Array API
        q.push(function (cb) {
            const result = message.utf8Data
            cb(null, result)
        })

        

        q.on('success', function (result) {
            //console.log('The result is:', result)

            
            
            
            
            })
            
            // begin processing, get notified on end / failure
            q.start(function (err) {
            if (err) throw err
                    console.log(q.results[0])
                   
                        var inter = setInterval(function () {
                            
                            if(q.results.length > 0){
                            const res =  axios.get('https://vrushaket.herokuapp.com/api/fb_rtb_msg/', 
                                { params: {
                                    api_key: "123456",
                                    firstname: "SJ",
                                    lastname:"SJ1",
                                    email:"asd@sdfsf.com",
                                    phone:"123123123",
                                    message:q.results[0]
                                } 
                            });
                            
                            console.log("send(get) api to firebase db  ")
                            q.results.pop()
                            console.log("Pop from queue ")
                            console.log("Lengh is:"+q.results.length)
                            }
                            else{
                                // console.log("Empty")
                                clearInterval(inter);
                            }
                        }, 
                        5000);
                    
                    


            })
        
            });


    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});