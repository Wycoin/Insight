package main


import (
    "net/http"
    "log"
    "fmt"
    "time"
    "os"
    "encoding/json"
    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
    "github.com/gin-gonic/contrib/static"
    "gopkg.in/mgo.v2"
)

type LogEvent struct {
        Source  string
        Time    time.Time
        Event   string
        Status  string
}

var to_cast LogEvent
var _run bool

func main() {
    app := gin.Default()
    app.Use(static.Serve("/", static.LocalFile("./public", true)))

    v1 := app.Group("/notifications")
    {
        v1.POST("", func(c *gin.Context){
            message := c.PostForm("event")
            status  := c.PostForm("status")
            node    := c.PostForm("source")

            if len(message) > 0 && len(node) > 0 {
                to_cast = postEvent(node, message, status)
                _run = true
                c.JSON(200, "Notification added")
            } else {
                c.JSON(204, "Notification not added")
            }

        })

        v1.GET("", func(c *gin.Context){
            c.JSON(200, getEvents())
        })

        v1.GET("/ws", func(c *gin.Context) {
            wshandler(c.Writer, c.Request)
        })
    }
    app.Run(":2340")
}

func getEvents() []LogEvent{
        session, err := mgo.Dial(os.Getenv("MONGO_URL"))
        if err != nil {
                panic(err)
        }
        defer session.Close()
        c := session.DB("insight").C("events")


        var result []LogEvent
        err = c.Find(nil).All(&result)
        if err != nil {
                log.Fatal(err)
        }

        return result

}

func postEvent(source string, event string, status string) LogEvent{
        session, err := mgo.Dial(os.Getenv("MONGO_URL"))
        if err != nil {
                panic(err)
        }
        defer session.Close()
        c := session.DB("insight").C("events")

        err = c.Insert(&LogEvent{source,time.Now(), event, status})
        if err != nil {
                log.Fatal(err)
        }

        return LogEvent{source,time.Now(), event, status}
}

// sockets
var wsupgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

func wshandler(w http.ResponseWriter, r *http.Request) {
    conn, err := wsupgrader.Upgrade(w, r, nil)
    if err != nil {
        fmt.Println("Failed to set websocket upgrade: %+v", err)
        return
    }

    for {
        if _run{
            fmt.Println("sending socket ping")
            b,_ := json.Marshal(to_cast)
            conn.WriteMessage(1,[]byte(b))
            _run = false
        }

    }
}