// (Assume this is the start of your utils.go file)
package utils

import (
	"errors"
	"strconv"
)

// StringToUint converts a string to uint, returning an error if conversion fails.
func StringToUint(s string) (uint, error) {
	val, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		return 0, errors.New("invalid uint string")
	}
	return uint(val), nil
}
