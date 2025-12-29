package com.doggycare.creactiva.doggycare_rest.controller;

import com.doggycare.creactiva.doggycare_rest.dto.RegistroCompletoDTO;
import com.doggycare.creactiva.doggycare_rest.model.Direccion;
import com.doggycare.creactiva.doggycare_rest.model.Usuario;
import com.doggycare.creactiva.doggycare_rest.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth") //http://localhost:8080/api/auth/
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // --- ENDPOINT 1: REGISTRO ---
    @PostMapping("/registro-completo")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroCompletoDTO dto) {

        //Validar que el usuario ya existe
        if(usuarioRepository.existsByEmail(dto.getUsuario().email)) {
            return ResponseEntity.badRequest().body("Usuario ya existe");
        }

        //Creacion del usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getUsuario().nombre);
        usuario.setApPaterno(dto.getUsuario().apPaterno);
        usuario.setApMaterno(dto.getUsuario().apMaterno);
        usuario.setEmail(dto.getUsuario().email);
        usuario.setTelefono(dto.getUsuario().telefono);
        //Usar BCrypt para encriptar
        usuario.setPasswordHash(dto.getUsuario().password);

        //Crear entidad direccion
        Direccion dir = new Direccion();
        dir.setCp(dto.getDireccion().cp);
        dir.setEstado(dto.getDireccion().estado);
        dir.setAlcaldia(dto.getDireccion().alcaldia);
        dir.setColonia(dto.getDireccion().colonia);
        dir.setTipoCalle(dto.getDireccion().tipoCalle);
        dir.setCalle(dto.getDireccion().calle);
        dir.setNumExterior(dto.getDireccion().numExterior);
        dir.setNumInterior(dto.getDireccion().numInterior);

        //Crear relacion
        usuario.setDireccion(dir);
        dir.setUsuario(usuario);

        //Guardar en BD
        usuarioRepository.save(usuario);

        Map<String, String> response =  new HashMap<>();
        response.put("mensaje", "Usuario registrado correctamente");
        response.put("nombre", usuario.getNombre());

        return ResponseEntity.ok(response);
    }

    // --- ENDPOINT 2: login ---
    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if(usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if(password.equals(usuario.getPasswordHash())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", usuario.getIdUsuario());
                response.put("nombre", usuario.getNombre());
                response.put("email", usuario.getEmail());

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Credenciales no coinciden");
    }
}
