package com.tum.smartcalendar.calendar.dto;

import java.util.List;

public class ScheduleFrontendRequestDTO {

    private List<FreeSlotDTO> freeSlots;

    public ScheduleFrontendRequestDTO() {} // REQUIRED

    public ScheduleFrontendRequestDTO(List<FreeSlotDTO> freeSlots) {
        this.freeSlots = freeSlots;
    }

    public List<FreeSlotDTO> getFreeSlots() {
        return freeSlots;
    }

    public void setFreeSlots(List<FreeSlotDTO> freeSlots) {
        this.freeSlots = freeSlots;
    }
}

