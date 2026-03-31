package com.oxaro.api.support.dtos;

import lombok.NoArgsConstructor;

/**
 * DTO class defining a lookup item that needs a French and English label
 */
@NoArgsConstructor
public class Lookup_Item_DTO {

    public String ID;
    public String Group;
    public String Label_EN;
    public String Label_FR;
    public String Order_EN; // Used to order English dropdowns if present
    public String Order_FR; // Used to order French dropdowns if present

    public Lookup_Item_DTO(String id) {
        this.ID = id;
        this.Label_EN = id;
        this.Label_FR = id;
    }

    public Lookup_Item_DTO(String id, String label_EN, String label_FR) {
        this.ID = id;
        this.Label_EN = label_EN;
        this.Label_FR = label_FR;
    }

    public Lookup_Item_DTO(int id, String label_EN, String label_FR) {
        this.ID = String.valueOf(id);
        this.Label_EN = label_EN;
        this.Label_FR = label_FR;
    }

    public Lookup_Item_DTO(int id, String group, String label_EN, String label_FR) {
        this.ID = String.valueOf(id);
        this.Group = group;
        this.Label_EN = label_EN;
        this.Label_FR = label_FR;
    }

    public Lookup_Item_DTO(String id, String group, String label_EN, String label_FR) {
        this.ID = id;
        this.Group = group;
        this.Label_EN = label_EN;
        this.Label_FR = label_FR;
    }

    public Lookup_Item_DTO(String id, String group, String label_EN, String label_FR, String order_EN, String order_FR) {
        this.ID = id;
        this.Group = group;
        this.Label_EN = label_EN;
        this.Label_FR = label_FR;
        this.Order_EN = order_EN;
        this.Order_FR = order_FR;
    }
}