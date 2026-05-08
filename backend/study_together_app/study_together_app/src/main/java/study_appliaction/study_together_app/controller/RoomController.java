package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import study_appliaction.study_together_app.entity.Message;
import study_appliaction.study_together_app.entity.Room;
import study_appliaction.study_together_app.repo.MessageRepository;
import study_appliaction.study_together_app.repo.RoomRepository;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE
        }
)
public class RoomController {

    @Autowired
    private RoomRepository roomRepo;

    @Autowired
    private MessageRepository msgRepo;

    // ====================================
    // ✅ GET USER
    // ====================================

    private String getUser() {

        Authentication auth =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (auth != null &&
                auth.getName() != null &&
                !auth.getName()
                        .equals("anonymousUser")) {

            return auth.getName();
        }

        return "guest";
    }

    // ====================================
    // ✅ CREATE ROOM
    // ====================================

    @PostMapping("/rooms")
    public Room createRoom(
            @RequestBody Room room
    ) {

        String email = getUser();

        room.setCreatedBy(email);

        room.setMemberCount(1);

        room.setMaxMembers(100);

        // creator auto joins
        room.getJoinedUsers()
                .add(email.toLowerCase());

        return roomRepo.save(room);
    }

    // ====================================
    // ✅ GET ROOMS
    // ====================================

    @GetMapping("/rooms")
    public List<Room> getRooms() {

        return roomRepo.findAll();
    }

    // ====================================
    // ✅ JOIN ROOM
    // ====================================

    @PostMapping("/rooms/join/{id}")
    public String joinRoom(
            @PathVariable Long id
    ) {

        Room room =
                roomRepo.findById(id)
                        .orElse(null);

        if (room == null) {
            return "Room not found";
        }

        String email = getUser();

        // not logged in
        if (email == null ||
                email.equals("guest") ||
                email.equals("anonymousUser")) {

            return "User not authenticated";
        }

        // null safety
        if (room.getJoinedUsers() == null) {

            room.setJoinedUsers(
                    new java.util.ArrayList<>()
            );
        }

        // already joined
        if (room.getJoinedUsers()
                .contains(email.toLowerCase())) {

            return "Already joined";
        }

        // room full
        if (room.getMemberCount() >=
                room.getMaxMembers()) {

            return "Room is full";
        }

        // add member
        room.getJoinedUsers()
                .add(email.toLowerCase());

        room.setMemberCount(
                room.getMemberCount() + 1
        );

        roomRepo.save(room);

        return "Joined successfully";
    }

    // ====================================
    // ✅ LEAVE ROOM
    // ====================================

    @PostMapping("/rooms/leave/{id}")
    public String leaveRoom(
            @PathVariable Long id
    ) {

        Room room =
                roomRepo.findById(id)
                        .orElse(null);

        if (room == null) {
            return "Room not found";
        }

        String email = getUser();

        if (room.getJoinedUsers() != null &&
                room.getJoinedUsers()
                        .contains(email.toLowerCase())) {

            room.getJoinedUsers()
                    .remove(email.toLowerCase());

            if (room.getMemberCount() > 0) {

                room.setMemberCount(
                        room.getMemberCount() - 1
                );
            }

            roomRepo.save(room);

            return "Left room";
        }

        return "User not in room";
    }

    // ====================================
    // ❌ DELETE ROOM
    // ====================================

    @DeleteMapping("/rooms/{id}")
    public String deleteRoom(
            @PathVariable Long id
    ) {

        String email = getUser();

        Room room =
                roomRepo.findById(id)
                        .orElse(null);

        if (room == null) {
            return "Room not found";
        }

        if (!room.getCreatedBy()
                .equalsIgnoreCase(email)) {

            return "Only creator can delete this room";
        }

        roomRepo.deleteById(id);

        return "Room deleted";
    }

    // ====================================
    // 💬 SEND MESSAGE
    // ====================================

    @PostMapping("/messages")
    public Message sendMessage(

            @RequestParam(required = false)
            String email,

            @RequestBody Message msg

    ) {

        String user = getUser();

        if ((user == null ||
                user.equals("guest") ||
                user.equals("anonymousUser"))
                && email != null) {

            user = email;
        }

        msg.setSender(user);

        return msgRepo.save(msg);
    }

    // ====================================
    // 📎 SEND FILE
    // ====================================

    @PostMapping("/messages/file")
    public Message uploadFileMessage(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("roomId")
            Long roomId,

            @RequestParam(required = false)
            String email

    ) {

        try {

            String user = getUser();

            if ((user == null ||
                    user.equals("guest") ||
                    user.equals("anonymousUser"))
                    && email != null) {

                user = email;
            }

            String uploadDir = "uploads/";

            Files.createDirectories(
                    Paths.get(uploadDir)
            );

            String fileName =
                    UUID.randomUUID() + "_" +
                            file.getOriginalFilename();

            Path filePath =
                    Paths.get(uploadDir, fileName);

            Files.write(
                    filePath,
                    file.getBytes()
            );

            Message msg = new Message();

            msg.setRoomId(roomId);

            msg.setSender(user);

            msg.setText("📎 Shared a file");

            msg.setTime(
                    java.time.LocalTime.now()
                            .withSecond(0)
                            .withNano(0)
                            .toString()
            );

            msg.setFileName(
                    file.getOriginalFilename()
            );

            msg.setFileUrl(
                    "http://localhost:8080/uploads/"
                            + fileName
            );

            return msgRepo.save(msg);

        } catch (Exception e) {

            e.printStackTrace();

            return null;
        }
    }

    // ====================================
    // 🗑 DELETE MESSAGE
    // ====================================

    @DeleteMapping("/messages/{id}")
    public String deleteMessage(
            @PathVariable Long id
    ) {

        Message msg =
                msgRepo.findById(id)
                        .orElse(null);

        if (msg == null) {
            return "Message not found";
        }

        msgRepo.deleteById(id);

        return "Deleted";
    }

    // ====================================
    // 📥 GET ROOM MESSAGES
    // ====================================

    @GetMapping("/messages/{roomId}")
    public List<Message> getMessages(
            @PathVariable Long roomId
    ) {

        return msgRepo.findByRoomId(roomId);
    }
}