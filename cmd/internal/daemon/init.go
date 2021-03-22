package daemon

import (
	"github.com/gin-gonic/gin"
)

// Run run as deamon
func Run(debug bool) {
	if !debug {
		gin.SetMode(gin.ReleaseMode)
	}

	runServer()
}
