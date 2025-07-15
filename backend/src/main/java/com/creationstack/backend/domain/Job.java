package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Table(name = "jobs")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Job { // 직업 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId; // 직업 테이블 기본키

    @Column(length = 50, nullable = false, unique = true)
    private String name; // 직업 이름
}
