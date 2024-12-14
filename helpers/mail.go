package helpers

import "fmt"

func EmailDetails(otp int, to string) (subject, content string, attachFiles []string) {
	subject = fmt.Sprintf("Your OTP for Secure Login - %d", otp)

	content = `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>OTP Verification</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background-color: #f9f9f9;
				margin: 0;
				padding: 0;
			}
			.container {
				max-width: 600px;
				margin: 20px auto;
				background-color: #ffffff;
				padding: 20px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
				border-radius: 8px;
			}
			.header {
				text-align: center;
				color: #4CAF50;
			}
			.otp {
				font-size: 24px;
				color: #333;
				font-weight: bold;
				text-align: center;
				margin: 20px 0;
			}
			.message {
				color: #555;
				line-height: 1.6;
				margin-bottom: 20px;
			}
			.footer {
				font-size: 12px;
				text-align: center;
				color: #888;
				margin-top: 20px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h1 class="header">Verify Your Email</h1>
			<p class="message">Dear <strong>%s</strong>,</p>
			<p class="message">Thank you for choosing our service. To complete your sign-up process, please use the following OTP to verify your email address:</p>
			<p class="otp">%d</p>
			<p class="message">If you did not request this email, please ignore it. The OTP is valid for the next 10 minutes.</p>
			<p class="message">Thank you for your trust in us!</p>
			<p class="message">Best regards,<br>Shubham from Calorymeter</p>
			<div class="footer">
				<p>Please do not reply to this email. If you have any questions, contact our support team.</p>
			</div>
		</div>
	</body>
	</html>
	`

	content = fmt.Sprintf(content, to, otp)
	attachFiles = []string{}

	return
}
