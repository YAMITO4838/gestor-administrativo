package trabajito.WebOnes.Sistema_de_administracion.model;



import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import java.time.LocalDate;



@Entity

@Table(name = "tasks")

public class Task {



    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;



    @ManyToOne(fetch = FetchType.LAZY)

    @JoinColumn(name = "project_id", nullable = false)

    @JsonBackReference

    private Project project;



    private String title;

    private String description;



    @ManyToOne

    @JoinColumn(name = "assignee_id")

    private User assignee;



    @Enumerated(EnumType.STRING)

    private TaskStatus status;



    private String priority;

    private LocalDate dueDate;



    public Task() {}



    public Task(Project project, String title, String description, User assignee, TaskStatus status, String priority, LocalDate dueDate) {

        this.project = project;

        this.title = title;

        this.description = description;

        this.assignee = assignee;

        this.status = status;

        this.priority = priority;

        this.dueDate = dueDate;

    }



    // Getters y Setters

    public Long getId() {

        return id;

    }



    public void setId(Long id) {

        this.id = id;

    }



    public Project getProject() {

        return project;

    }



    public void setProject(Project project) {

        this.project = project;

    }



    public String getTitle() {

        return title;

    }



    public void setTitle(String title) {

        this.title = title;

    }



    public String getDescription() {

        return description;

    }



    public void setDescription(String description) {

        this.description = description;

    }



    public User getAssignee() {

        return assignee;

    }



    public void setAssignee(User assignee) {

        this.assignee = assignee;

    }



    public TaskStatus getStatus() {

        return status;

    }



    public void setStatus(TaskStatus status) {

        this.status = status;

    }



    public String getPriority() {

        return priority;

    }



    public void setPriority(String priority) {

        this.priority = priority;

    }



    public LocalDate getDueDate() {

        return dueDate;

    }



    public void setDueDate(LocalDate dueDate) {

        this.dueDate = dueDate;

    }

}