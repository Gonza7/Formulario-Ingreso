package com.example.formulario.Controller;

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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
public class FormularioController {
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestParam("pdf") MultipartFile pdf,
                                            @RequestParam("solicitante") String solicitante,
                                            @RequestParam("email") String email,
                                            @RequestParam("fechahora") String fechahora,
                                            @RequestParam("espacio") String espacio) throws DocumentException, MessagingException, IOException {

        // Convertir el PDF a InputStreamSource
        InputStreamSource pdfSource = new ByteArrayResource(pdf.getBytes());

        // Enviar el correo electrónico
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        String e="gonzaguzman60@gmail.com";
        helper.setTo(e);
        helper.setSubject("Solicitud de ingreso a la universidad");
        helper.setText("Solicitud de ingreso a la universidad"+"\nSolicitante: "+solicitante+
                "\nCorreo electrónico: "+email+"\nFecha y hora: "+fechahora+"\nEspacio: "+espacio);
        helper.addAttachment("Solicitud_"+solicitante+".pdf", pdfSource);

        mailSender.send(mimeMessage);

        return ResponseEntity.ok("Email enviado con éxito");
    }
}
