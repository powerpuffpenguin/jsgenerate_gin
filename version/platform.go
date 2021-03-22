package version

import (
	"runtime"

	"github.com/gin-gonic/gin"
)

// Platform .
var Platform = runtime.GOOS +
	` ` + runtime.GOARCH +
	` ` + runtime.Version() +
	` gin-` + gin.Version
