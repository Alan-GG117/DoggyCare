package com.doggycare.creactiva.doggycare_rest.controller;

import com.doggycare.creactiva.doggycare_rest.dto.ReporteDTO;
import com.doggycare.creactiva.doggycare_rest.model.Mascota;
import com.doggycare.creactiva.doggycare_rest.model.Reporte;
import com.doggycare.creactiva.doggycare_rest.repository.MascotaRepository;
import com.doggycare.creactiva.doggycare_rest.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired private ReporteRepository reporteRepository;
    @Autowired private MascotaRepository mascotaRepository;

    @PostMapping("/crear")
    public ResponseEntity<?> crearReporte(@RequestBody ReporteDTO dto) {

        Mascota mascota = mascotaRepository.findById(dto.idMascota)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        Reporte reporte = new Reporte();
        reporte.setUbicacion(dto.ubicacion);
        reporte.setComportamiento(dto.comportamiento);
        reporte.setNotas(dto.notas);
        reporte.setMascota(mascota);

        mascota.setEstaExtraviada(true);

        reporteRepository.save(reporte);
        mascotaRepository.save(mascota);

        return ResponseEntity.ok("Reporte Generado y Alerta Activada");
    }
}
