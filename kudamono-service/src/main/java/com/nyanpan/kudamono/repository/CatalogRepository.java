package com.nyanpan.kudamono.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.nyanpan.kudamono.model.CatalogItem;

public interface CatalogRepository extends MongoRepository<CatalogItem, String> {
    
    List<CatalogItem> findBySeries(String series);

    @Query(value = "{ '$expr': { '$eq': [ { '$replaceAll': { 'input': { '$toLower': '$name' }, 'find': ' ', 'replacement': '' } }, { '$toLower': ?0 } ] } }")
    Optional<CatalogItem> findByNameIgnoreCase(String name);

    List<CatalogItem> findByNameContainingIgnoreCase(String name);
}
