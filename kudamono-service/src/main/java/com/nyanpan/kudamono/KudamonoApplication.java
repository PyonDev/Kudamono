package com.nyanpan.kudamono;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class KudamonoApplication {

	public static void main(String[] args) {
		SpringApplication.run(KudamonoApplication.class, args);
	}

}
