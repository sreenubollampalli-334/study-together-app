package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import study_appliaction.study_together_app.entity.PrivateMessage;
import study_appliaction.study_together_app.repo.PrivateMessageRepo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.UUID;

@RestController
@RequestMapping("/api/private-messages")
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "https://study-together-app-p79u.vercel.app"
    },
    allowedHeaders = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE
    }
)
public class PrivateMessageController {

    @Autowired
    private PrivateMessageRepo repo;

    // ====================================
    // 📤 SEND TEXT MESSAGE
    // ====================================

    @PostMapping("/send")
    public PrivateMessage send(
            @RequestBody PrivateMessage msg
    ) {

        if (msg.getSenderEmail() == null ||
                msg.getReceiverEmail() == null) {

            throw new RuntimeException("Invalid message");
        }

        msg.setTimestamp(LocalDateTime.now());

        return repo.save(msg);
    }

    // ====================================
    // 📎 SEND FILE
    // ====================================

    @PostMapping("/send-file")
    public PrivateMessage sendFile(

            @RequestParam("file") MultipartFile file,
            @RequestParam String senderEmail,
            @RequestParam String receiverEmail

    ) {

        try {

            // ✅ CREATE FOLDER
            String uploadDir = "uploads/";

            Files.createDirectories(Paths.get(uploadDir));

            // ✅ UNIQUE NAME
            String fileName =
                    UUID.randomUUID() + "_" +
                            file.getOriginalFilename();

            Path filePath =
                    Paths.get(uploadDir, fileName);

            // ✅ SAVE FILE
            Files.write(filePath, file.getBytes());

            // ✅ CREATE MESSAGE
            PrivateMessage msg =
                    new PrivateMessage();

            msg.setSenderEmail(senderEmail);

            msg.setReceiverEmail(receiverEmail);

            msg.setContent("📎 Shared a file");

            msg.setTimestamp(LocalDateTime.now());

            msg.setFileName(
                    file.getOriginalFilename()
            );

          msg.setFileUrl(
    "https://study-together-app-1.onrender.com/uploads/" + fileName
);

            return repo.save(msg);

        } catch (Exception e) {

            e.printStackTrace();

            return null;
        }
    }

    // ====================================
    // 📥 GET CHAT
    // ====================================

    @GetMapping
    public List<PrivateMessage> getMessages(

            @RequestParam String user1,
            @RequestParam String user2

    ) {

        return repo.getChat(user1, user2);
    }

    // ====================================
    // 🗑 DELETE MESSAGE
    // ====================================

    @DeleteMapping("/delete/{id}")
    public String deleteMessage(
            @PathVariable Long id
    ) {

        PrivateMessage msg =
                repo.findById(id).orElse(null);

        if (msg == null) {
            return "Message not found";
        }

        repo.deleteById(id);

        return "Deleted";
    }
}