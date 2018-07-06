package com.greengrowapps.shoppinglist.security;

import com.greengrowapps.shoppinglist.domain.User;
import com.greengrowapps.shoppinglist.service.UserService;
import com.greengrowapps.shoppinglist.web.rest.errors.UnauthorizedException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("userSecurityUtils")
public class UserSecurityUtils {

    private final UserService userService;

    public UserSecurityUtils(UserService userService) {
        this.userService = userService;
    }

    public User GetCurrentUserOrThrowUnauthorized() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();

        if(!login.isPresent()){
            throw new UnauthorizedException();
        }

        Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(login.get());

        if(!userOptional.isPresent()){
            throw new UnauthorizedException();
        }

        return userOptional.get();
    }
}

