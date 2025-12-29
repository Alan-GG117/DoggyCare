package com.doggycare.creactiva.doggycare_rest.dto;

import com.doggycare.creactiva.doggycare_rest.model.Mascota;
import com.doggycare.creactiva.doggycare_rest.model.Vacuna;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.List;

public class MascotaDTO {
    @JsonProperty("idDueño")
    private Long idDueño;

    private String nombre;
    private String especie;
    private String raza;
    private String sexo;
    private String tamano;
    private String tipoPelo;
    private String color;
    private Boolean esterilizado;
    private String senasParticulares;
    private String ruac;

    // Objeto anidado para el Chip
    private ChipDTO chip;

    // Lista de objetos para las Vacunas
    private List<VacunaDTO> historialVacunas;

    // --- GETTERS Y SETTERS ---
    public Long getIdDueño() { return idDueño; }
    public void setIdDueño(Long idDueño) { this.idDueño = idDueño; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public String getTamano() { return tamano; }
    public void setTamano(String tamano) { this.tamano = tamano; }

    public String getTipoPelo() { return tipoPelo; }
    public void setTipoPelo(String tipoPelo) { this.tipoPelo = tipoPelo; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Boolean getEsterilizado() { return esterilizado; }
    public void setEsterilizado(Boolean esterilizado) { this.esterilizado = esterilizado; }

    public String getSenasParticulares() { return senasParticulares; }
    public void setSenasParticulares(String senasParticulares) { this.senasParticulares = senasParticulares; }

    public String getRuac() { return ruac; }
    public void setRuac(String ruac) { this.ruac = ruac; }

    public ChipDTO getChip() { return chip; }
    public void setChip(ChipDTO chip) { this.chip = chip; }

    public List<VacunaDTO> getHistorialVacunas() { return historialVacunas; }
    public void setHistorialVacunas(List<VacunaDTO> historialVacunas) { this.historialVacunas = historialVacunas; }

    // --- CLASES INTERNAS (Static Inner Classes) ---

    public static class ChipDTO {
        private boolean tieneChip;
        private String tipo;
        private String numero;

        // Getters y Setters
        public boolean isTieneChip() { return tieneChip; }
        public void setTieneChip(boolean tieneChip) { this.tieneChip = tieneChip; }
        public String getTipo() { return tipo; }
        public void setTipo(String tipo) { this.tipo = tipo; }
        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }
    }

    public static class VacunaDTO {
        private String nombre;
        // Lo recibimos como String desde el JSON y el Controller lo convierte a LocalDate
        private String fechaAplicacion;
        // Lo recibimos como String y el Controller lo convierte a Integer
        private String duracionMeses;

        // Getters y Setters
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getFechaAplicacion() { return fechaAplicacion; }
        public void setFechaAplicacion(String fechaAplicacion) { this.fechaAplicacion = fechaAplicacion; }
        public String getDuracionMeses() { return duracionMeses; }
        public void setDuracionMeses(String duracionMeses) { this.duracionMeses = duracionMeses; }
    }
}
