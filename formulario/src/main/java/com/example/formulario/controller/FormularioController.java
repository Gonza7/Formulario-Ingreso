package com.example.formulario.controller;

import com.itextpdf.text.DocumentException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class FormularioController {
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestParam("pdf") MultipartFile pdf) throws DocumentException, MessagingException, IOException {

        // Convertir el PDF a InputStreamSource
        InputStreamSource pdfSource = new ByteArrayResource(pdf.getBytes());

        // Enviar el correo electrónico
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        String email="gonzaguzman60@gmail.com";
        helper.setTo(email);
        helper.setSubject("Documento PDF");
        helper.setText("Adjunto encontrarás el documento PDF.");
        helper.addAttachment("document.pdf", pdfSource);

        mailSender.send(mimeMessage);

        return ResponseEntity.ok("Email enviado con éxito");
    }
}
