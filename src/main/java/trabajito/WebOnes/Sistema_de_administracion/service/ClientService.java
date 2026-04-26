package trabajito.WebOnes.Sistema_de_administracion.service;

import trabajito.WebOnes.Sistema_de_administracion.model.Client;
import java.util.List;
import java.util.Optional;

public interface ClientService {

    Client saveClient(Client client);
    
    List<Client> findAllClients();
    
    Optional<Client> findById(Long id);
    
    Client updateClient(Long id, Client clientDetails);
    
    void deleteClient(Long id);
}