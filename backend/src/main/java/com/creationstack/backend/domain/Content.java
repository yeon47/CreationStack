package com.creationstack.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "contents")
public class Content {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long contentId;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String content;

}
