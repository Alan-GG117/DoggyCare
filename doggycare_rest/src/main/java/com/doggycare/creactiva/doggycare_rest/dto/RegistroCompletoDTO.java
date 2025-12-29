package com.doggycare.creactiva.doggycare_rest.dto;

public class RegistroCompletoDTO {
    //Atributos
    private UsuarioDTO usuario;
    private DireccionDTO direccion;

    //Getters y Setters
    public UsuarioDTO getUsuario() {
        return usuario;
    }
    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }
    public DireccionDTO getDireccion() {
        return direccion;
    }
    public void setDireccion(DireccionDTO direccion) {
        this.direccion = direccion;
    }

    //Clases internas estaticas
    public static class UsuarioDTO {
        public String nombre;
        public String apPaterno;
        public String apMaterno;
        public String email;
        public String telefono;
        public String password;
    }

    public static class DireccionDTO {
        public String cp;
        public String estado;
        public String alcaldia;
        public String colonia;
        public String tipoCalle;
        public String calle;
        public String numExterior;
        public String numInterior;
    }
}
