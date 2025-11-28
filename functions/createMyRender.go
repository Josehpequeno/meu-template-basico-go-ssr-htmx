package functions

import (
	"html/template"

	"github.com/gin-contrib/multitemplate"
)

func CreateMyRender() multitemplate.Renderer {
	r := multitemplate.NewRenderer()

	funcMap := TemplateFunctions()

	// 1. Carrega o template base + componentes
	baseTemplates := template.Must(
		template.New("base.html").Funcs(funcMap).ParseFiles(
			"templates/base.html",
			"templates/components/navbar.html",      // Adiciona navbar
			"templates/components/navbarLinks.html", // Adiciona links navbar
		),
	)

	// 2. Templates principais (herdam base.html) e que podem ser retornados com c.HTML()
	templates := []struct {
		name  string
		files []string
	}{
		{"index", []string{"templates/index.html"}},
		{"login", []string{"templates/login.html"}},
	}

	// Templates parciais/fragmentos (NÃO herdam base.html)
	partialTemplates := []struct {
		name  string
		files []string
	}{}

	//adiciona templates
	for _, tmpl := range templates {
		t := template.Must(baseTemplates.Clone())
		t = template.Must(t.ParseFiles(tmpl.files...))
		r.Add(tmpl.name, t)
	}

	//adiciona templates parciais/fragmentos
	for _, pTmpl := range partialTemplates {
		t := template.Must(template.New(pTmpl.name).Funcs(funcMap).ParseFiles(pTmpl.files...))
		r.Add(pTmpl.name, t)
	}

	return r
}
