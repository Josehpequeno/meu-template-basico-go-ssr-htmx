package functions

import (
	"fmt"
	"html/template"
)

// seq gera uma sequência de números de 1 até n.
func seq(n int) []int {
	sequence := make([]int, n)
	for i := 0; i < n; i++ {
		sequence[i] = i + 1
	}
	return sequence
}

func TemplateFunctions() template.FuncMap {
	return template.FuncMap{
		"safeHTML": func(s string) template.HTML {
			return template.HTML(s)
		},
		"length": func(v interface{}) int {
			switch v := v.(type) {
			case string:
				return len(v)
			case []int:
				return len(v)
			case []interface{}:
				return len(v)
			case map[interface{}]interface{}:
				return len(v)
			default:
				return 0
			}
		},
		"sub": func(a, b int) int {
			return a - b
		}, "add": func(a, b int) int {
			return a + b
		}, "mul": func(a, b int) int {
			return a * b
		}, "seq": seq,
		"len": func(s string) int {
			return len(s)
		},
		"neq": func(a, b interface{}) bool {
			return a != b
		}, "eq": func(a, b interface{}) bool {
			return a == b
		},
		"eqRole": func(a, b interface{}) bool {
			sa := fmt.Sprint(a)
			sb := fmt.Sprint(b)
			return sa == sb
		}, "eqString": func(a, b interface{}) bool {
			var n, s string
			switch v := a.(type) {
			case *string:
				if v != nil {
					n = *v
				}
			case string:
				n = v
			}
			switch v := b.(type) {
			case *string:
				if v != nil {
					s = *v
				}
			case string:
				s = v
			}
			if n == "" || s == "" {
				return false
			}
			return n == s
		}, "deref": func(s *string) string {
			return *s
		},
	}

}
