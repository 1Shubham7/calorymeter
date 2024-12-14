package helpers

func EmailDetails() (subject, content string, attachFiles []string) {
	subject = "I hate Soan Papdi and Momos"

	content = `
	<h1>Hey There</h1>
	<p>I want to confess something. This has been eating me up for years, and now I can't help but tell you about it.
	I want to tell you that I hate Soan Papdi — it tastes like medicine. And momos... I hate the taste of momos.</p>
	`

	attachFiles = []string{}

	return
}