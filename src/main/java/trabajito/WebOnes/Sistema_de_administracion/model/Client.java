package trabajito.WebOnes.Sistema_de_administracion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String razonSocial;

    @Column(length = 100)
    private String contactoPrincipal;

    @Column(length = 100)
    private String correoContacto;

    @Column(length = 20)
    private String telefono;
}