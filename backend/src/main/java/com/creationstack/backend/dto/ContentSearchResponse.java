package com.creationstack.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ContentSearchResponse<T> {
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
    private List<T> contents;
}
