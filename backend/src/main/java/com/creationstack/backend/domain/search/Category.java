package com.creationstack.backend.domain.search;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Builder
@Table(name = "categories")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Category { // 카테고리 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId; // 카테고리 테이블 기본키

    @Column(length = 50, nullable = false, unique = true)
    private String name; // 미리 저장된 카테고리 값
}
