package mail

import (
	"fmt"
	"net/smtp"

	"github.com/jordan-wright/email"
)

// we use gmail as host from  sending mails
const (
	smtpAuthAddress   = "smtp.gmail.com"
	smtpServerAddress = "smtp.gmail.com:587" // 587 is recommended port for sending email securely
	// as it allows for encryption between the client (your application) and the server (Gmail’s SMTP server)
)

type EmailSender interface {
	SendEmail(subject, content string, to, cc, bcc, attachFiles []string) error
}

type Sender struct {
	Name     string
	Email    string
	Password string
}

func NewSender(name, email, password string) EmailSender {
	return &Sender{
		Name:     name,
		Email:    email,
		Password: password,
	}
}

func (s *Sender) SendEmail(subject, content string, to, cc, bcc, attachFiles []string) error {
	e := email.NewEmail()
	e.From = s.Name
	e.Subject = subject
	e.HTML = []byte(content)
	e.To = to
	e.Cc = cc
	e.Bcc = bcc

	for _, file := range attachFiles {
		_, err := e.AttachFile(file)
		if err != nil {
			return fmt.Errorf("issue in  attaching file %s: %w", file, err)
		}
	}

	smtpAuth := smtp.PlainAuth("", s.Email, s.Password, smtpAuthAddress)
	err := e.Send(smtpServerAddress, smtpAuth)
	return err
}