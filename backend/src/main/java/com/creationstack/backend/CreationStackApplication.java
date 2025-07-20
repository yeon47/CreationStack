package com.creationstack.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class CreationStackApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory(".")
				.ignoreIfMalformed()
				.ignoreIfMissing()
				.load();

		System.setProperty("portone.apisecret", dotenv.get("PORTONE_API_SECRET"));
		System.setProperty("portone.hostname", dotenv.get("PORTONE_HOSTNAME"));

		SpringApplication.run(CreationStackApplication.class, args);
	
		 BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		 
		 String rawPassword = "user1234";
	        String encoded1 = encoder.encode(rawPassword);
	        System.out.println("BCrypt user해시: " + encoded1);   
	        System.out.println(encoder.matches("user1234","$2a$10$nK638Z5uglBEMLDDiagFhum99TIpFasjU1ttl46.8gaqbkgxV8SrO"));

		 String rawPassword2 = "creator1234";
	        String encoded2 = encoder.encode(rawPassword2);
	        System.out.println("BCrypt creator해시: " + encoded2);
	        System.out.println(encoder.matches("creator1234", "$2a$10$qvlj4Or4wJLIw3V3wJ/RB.HoOl8Ls/kWktLKU8ZEvTtE7w7FiWMnS"));

	        String encoded = "$2a$10$E9B/XaqB/SJrJgcbr..dCO6ErwsxswTGdV5rlTmkfmUsKCy1qrewW";
	        System.out.println(encoder.matches("Pass9876!", encoded)); // true 여야 정상


	}

}