package com.nyanpan.kudamono.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nyanpan.kudamono.model.CatalogItem;

public interface CatalogRepository extends MongoRepository<CatalogItem, String> {
    
    List<CatalogItem> findBySeries(String series);

    Optional<CatalogItem> findByNameIgnoreCase(String name);

    List<CatalogItem> findByNameContainingIgnoreCase(String name);
}
