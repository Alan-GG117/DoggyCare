package com.doggycare.creactiva.doggycare_rest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mascotas")
public class Mascota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMascota;

    private String nombre;
    private String especie;
    private String raza;
    private String sexo;
    private String tamano;
    private String tipoPelo;
    private String colorPelo;
    private Boolean esterilizado;
    private String senasParticulares;
    private String ruac;

    // Datos del Chip
    private Boolean tieneChip;
    private String tipoChip;
    private String numeroChip;

    private String fotoUrl; // Aquí guardaremos la ruta de la imagen
    private Boolean estaExtraviada = false;

    @ManyToOne
    @JoinColumn(name = "id_dueno")
    @JsonIgnore
    private Usuario dueno;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL)
    private List<Vacuna> vacunas = new ArrayList<Vacuna>();

    //Metodo helper para agregar vacunas facilmente
    public void agregarVacuna(Vacuna vacuna) {
        vacunas.add(vacuna);
        vacuna.setMascota(this);
    }

    public Long getIdMascota() {
        return idMascota;
    }

    public void setIdMascota(Long idMascota) {
        this.idMascota = idMascota;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getTamano() {
        return tamano;
    }

    public void setTamano(String tamano) {
        this.tamano = tamano;
    }

    public String getTipoPelo() {
        return tipoPelo;
    }

    public void setTipoPelo(String tipoPelo) {
        this.tipoPelo = tipoPelo;
    }

    public String getColorPelo() {
        return colorPelo;
    }

    public void setColorPelo(String colorPelo) {
        this.colorPelo = colorPelo;
    }

    public Boolean getEsterilizado() {
        return esterilizado;
    }

    public void setEsterilizado(Boolean esterilizado) {
        this.esterilizado = esterilizado;
    }

    public String getSenasParticulares() {
        return senasParticulares;
    }

    public void setSenasParticulares(String senasParticulares) {
        this.senasParticulares = senasParticulares;
    }

    public String getRuac() {
        return ruac;
    }

    public void setRuac(String ruac) {
        this.ruac = ruac;
    }

    public Boolean getTieneChip() {
        return tieneChip;
    }

    public void setTieneChip(Boolean tieneChip) {
        this.tieneChip = tieneChip;
    }

    public String getTipoChip() {
        return tipoChip;
    }

    public void setTipoChip(String tipoChip) {
        this.tipoChip = tipoChip;
    }

    public String getNumeroChip() {
        return numeroChip;
    }

    public void setNumeroChip(String numeroChip) {
        this.numeroChip = numeroChip;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public Boolean getEstaExtraviada() {
        return estaExtraviada;
    }

    public void setEstaExtraviada(Boolean estaExtraviada) {
        this.estaExtraviada = estaExtraviada;
    }

    public Usuario getDueno() {
        return dueno;
    }

    public void setDueno(Usuario dueno) {
        this.dueno = dueno;
    }

    public List<Vacuna> getVacunas() {
        return vacunas;
    }

    public void setVacunas(List<Vacuna> vacunas) {
        this.vacunas = vacunas;
    }
}
