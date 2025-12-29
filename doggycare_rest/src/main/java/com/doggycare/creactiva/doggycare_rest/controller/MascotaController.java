package com.doggycare.creactiva.doggycare_rest.controller;

import com.doggycare.creactiva.doggycare_rest.dto.MascotaDTO;
import com.doggycare.creactiva.doggycare_rest.model.Mascota;
import com.doggycare.creactiva.doggycare_rest.model.Usuario;
import com.doggycare.creactiva.doggycare_rest.model.Vacuna;
import com.doggycare.creactiva.doggycare_rest.repository.MascotaRepository;
import com.doggycare.creactiva.doggycare_rest.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    @Autowired private MascotaRepository mascotaRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    private final String UPLOAD_DIR = "uploads/"; //Direccion a guardar para la imagen

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> registrarMascota(
            @RequestParam("datos") String datosJson,
            @RequestParam("file")MultipartFile file) throws IOException {

        //Convertir String JSON a Objeto Java
        ObjectMapper mapper = new ObjectMapper();
        MascotaDTO dto =  mapper.readValue(datosJson, MascotaDTO.class);

        //Buscar al dueño
        Usuario dueno = usuarioRepository.findById(dto.getIdDueño())
                .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));

        //Guardar la imagen en el disco
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        //Generar nombre unico para evitar duplicados
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        //Mapeo correspondiente
        Mascota mascota = new Mascota();
        mascota.setNombre(dto.getNombre());
        mascota.setEspecie(dto.getEspecie());
        mascota.setRaza(dto.getRaza());
        mascota.setSexo(dto.getSexo());
        mascota.setTamano(dto.getTamano());
        mascota.setTipoPelo(dto.getTipoPelo());
        mascota.setColorPelo(dto.getColor());
        mascota.setEsterilizado(dto.getEsterilizado());
        mascota.setSenasParticulares(dto.getSenasParticulares());
        mascota.setRuac(dto.getRuac());
        mascota.setTieneChip(dto.getChip().isTieneChip());
        mascota.setTipoChip(dto.getChip().getTipo());
        mascota.setNumeroChip(dto.getChip().getNumero());

        mascota.setFotoUrl(filePath.toString()); // Guardamos la ruta
        mascota.setDueno(dueno);

        //Agregar vacunas
        if(dto.getHistorialVacunas() != null) {
            for(MascotaDTO.VacunaDTO vDto : dto.getHistorialVacunas()) {
                Vacuna v =  new Vacuna();
                v.setNombreVacuna(vDto.getNombre());
                v.setFechaAplicaion(java.time.LocalDate.parse(vDto.getFechaAplicacion()));
                v.setDuracionMeses(Integer.parseInt(vDto.getDuracionMeses()));
                mascota.agregarVacuna(v);
            }
        }

        mascotaRepository.save(mascota);
        return ResponseEntity.ok("Mascota registrada con exito");
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerMascotasPorUsuario(@PathVariable Long idUsuario) {
        List<Mascota> mascotas = mascotaRepository.findByDueno_IdUsuario(idUsuario);
        return ResponseEntity.ok(mascotas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerMascotasPorId(@PathVariable Long id) {
        return mascotaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/publicas/extraviadas")
    public ResponseEntity<?> obtenerMascotasExtraviadas() {
        List<Mascota> perdidas = mascotaRepository.findByEstaExtraviadaTrue();
        return ResponseEntity.ok(perdidas);
    }
}
