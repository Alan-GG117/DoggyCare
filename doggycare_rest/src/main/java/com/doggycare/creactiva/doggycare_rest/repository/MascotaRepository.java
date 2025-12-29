package com.doggycare.creactiva.doggycare_rest.repository;

import com.doggycare.creactiva.doggycare_rest.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByDueno_IdUsuario(Long idUsuario);
    List<Mascota> findByEstaExtraviadaTrue();
}
