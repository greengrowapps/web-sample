package com.greengrowapps.shoppinglist.service.mapper;

import com.greengrowapps.shoppinglist.domain.*;
import com.greengrowapps.shoppinglist.service.dto.FirebaseTokenDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity FirebaseToken and its DTO FirebaseTokenDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface FirebaseTokenMapper extends EntityMapper<FirebaseTokenDTO, FirebaseToken> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    FirebaseTokenDTO toDto(FirebaseToken firebaseToken);

    @Mapping(source = "userId", target = "user")
    FirebaseToken toEntity(FirebaseTokenDTO firebaseTokenDTO);

    default FirebaseToken fromId(Long id) {
        if (id == null) {
            return null;
        }
        FirebaseToken firebaseToken = new FirebaseToken();
        firebaseToken.setId(id);
        return firebaseToken;
    }
}
