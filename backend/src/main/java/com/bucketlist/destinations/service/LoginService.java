package com.bucketlist.destinations.service;

import com.bucketlist.destinations.model.User;
import com.bucketlist.destinations.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    protected UserRepository userRepository;

    @Autowired
    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String username, String password){
        return this.userRepository.findUserByUsernameAndPassword(username, password);
    }

    public User createAccount(User newUser){
        return this.userRepository.save(newUser);
    }
}
