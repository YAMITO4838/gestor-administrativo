package trabajito.WebOnes.Sistema_de_administracion.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.Client;
import trabajito.WebOnes.Sistema_de_administracion.repository.ClientRepository;
import trabajito.WebOnes.Sistema_de_administracion.service.ClientService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public List<Client> findAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public Client updateClient(Long id, Client details) {
        return clientRepository.findById(id).map(client -> {
            client.setRuc(details.getRuc());
            client.setRazonSocial(details.getRazonSocial());
            client.setContactoPrincipal(details.getContactoPrincipal());
            client.setCorreoContacto(details.getCorreoContacto());
            client.setTelefono(details.getTelefono());
            return clientRepository.save(client);
        }).orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    @Override
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}