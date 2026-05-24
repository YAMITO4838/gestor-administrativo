package trabajito.WebOnes.Sistema_de_administracion.model;

import jakarta.persistence.*;

@Entity

@Table(name = "clients")

public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(length = 30)
    private String ruc;

    @Column(nullable = false, length = 150)

    private String razonSocial;

    @Column(length = 100)

    private String contactoPrincipal;

    @Column(length = 100)

    private String correoContacto;

    @Column(length = 20)

    private String telefono;

    public Client() {
    }

    public Client(String razonSocial, String contactoPrincipal, String correoContacto, String telefono) {

        this.razonSocial = razonSocial;

        this.contactoPrincipal = contactoPrincipal;

        this.correoContacto = correoContacto;

        this.telefono = telefono;

    }

    // Getters y Setters

    public Long getId() {

        return id;

    }

    public void setId(Long id) {

        this.id = id;

    }

    public String getRuc() {

        return ruc;

    }

    public void setRuc(String ruc) {

        this.ruc = ruc;

    }

    public String getRazonSocial() {

        return razonSocial;

    }

    public void setRazonSocial(String razonSocial) {

        this.razonSocial = razonSocial;

    }

    public String getContactoPrincipal() {

        return contactoPrincipal;

    }

    public void setContactoPrincipal(String contactoPrincipal) {

        this.contactoPrincipal = contactoPrincipal;

    }

    public String getCorreoContacto() {

        return correoContacto;

    }

    public void setCorreoContacto(String correoContacto) {

        this.correoContacto = correoContacto;

    }

    public String getTelefono() {

        return telefono;

    }

    public void setTelefono(String telefono) {

        this.telefono = telefono;

    }

}