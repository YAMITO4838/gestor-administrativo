package trabajito.WebOnes.Sistema_de_administracion.model;



import jakarta.persistence.*;

import java.time.LocalDateTime;



@Entity

@Table(name = "messages")

public class Message {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;



    @ManyToOne

    @JoinColumn(name = "room_id", nullable = false)

    private ChatRoom room;



    @ManyToOne

    @JoinColumn(name = "sender_id", nullable = false)

    private User sender;



    @Column(columnDefinition = "TEXT")

    private String content;



    private LocalDateTime sentDate;



    public Message() {}



    public Message(ChatRoom room, User sender, String content) {

        this.room = room;

        this.sender = sender;

        this.content = content;

    }



    @PrePersist

    protected void onCreate() {

        this.sentDate = LocalDateTime.now();

    }



    // Getters y Setters

    public Long getId() {

        return id;

    }



    public void setId(Long id) {

        this.id = id;

    }



    public ChatRoom getRoom() {

        return room;

    }



    public void setRoom(ChatRoom room) {

        this.room = room;

    }



    public User getSender() {

        return sender;

    }



    public void setSender(User sender) {

        this.sender = sender;

    }



    public String getContent() {

        return content;

    }



    public void setContent(String content) {

        this.content = content;

    }



    public LocalDateTime getSentDate() {

        return sentDate;

    }



    public void setSentDate(LocalDateTime sentDate) {

        this.sentDate = sentDate;

    }

}