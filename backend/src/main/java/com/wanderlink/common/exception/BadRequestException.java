package com.wanderlink.common.exception;

/**
 * Thrown when request parameters or business constraints are violated.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
