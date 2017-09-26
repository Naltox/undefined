#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "var.h"
#include "io.h"
#include "std_math.h"
#include "http.h"
#include "buffer.h"


void std_array_push(struct var* v, struct var value) {
    var_array_push(v, value);
}
var std_array_pop(struct var* v) {
    return var_array_pop(v);
}
var std_array_length(struct var* v) {
    return var_array_length(v);
}
 
var user_handle_http_request(var request);

char* handler(char* request) {
    printf("Got request:\n%s\n\n", request);

    var response = user_handle_http_request(var_from_string(request));

    //printf("Got response:\n%s\n\n\n", var2str(response));

    char* resp_str;

    asprintf(&resp_str, "HTTP/1.1 400 Bad Request\nContent-Type: text/html\n\n%s", var2str(response));

    return resp_str;
}










static inline var op_infix_plus(var lhs, var rhs) {
    return std_plus(lhs, rhs);
}
static inline var op_infix_minus(var lhs, var rhs) {
    return std_minus(lhs, rhs);
}
static inline var op_infix_and(var lhs, var rhs) {
    return std_and(lhs, rhs);
}
static inline var op_infix_or(var lhs, var rhs) {
    return std_or(lhs, rhs);
}
static inline var op_infix_mul(var lhs, var rhs) {
    return std_mul(lhs, rhs);
}
static inline var op_infix_dev(var lhs, var rhs) {
    return std_dev(lhs, rhs);
}
static inline var op_infix_less(var lhs, var rhs) {
    return std_less(lhs, rhs);
}
static inline var op_infix_greater(var lhs, var rhs) {
    return std_greater(lhs, rhs);
}
static inline var op_infix_pow(var lhs, var rhs) {
    var i = var_from_int(0);
    while (var2bool(op_infix_less(i, op_infix_minus(rhs, var_from_int(1))))) {
        lhs = op_infix_mul(lhs, lhs);
        i = op_infix_plus(i, var_from_int(1));
    }
    return lhs;
}
static inline var op_infix_eq2(var lhs, var rhs) {
    return std_eq2(lhs, rhs);
}
static inline var op_infix_notEq2(var lhs, var rhs) {
    return std_notEq2(lhs, rhs);
}
static inline var op_prefix_not(var rhs) {
    return std_not(rhs);
}
static inline var op_postfix_incr(var lhs) {
    return std_incr(lhs);
}
static inline var op_postfix_decr(var lhs) {
    return std_decr(lhs);
}
static inline var op_prefix_minus(var rhs) {
    return std_negative(rhs);
}
static inline var op_infix_shiftRight(var lhs, var rhs) {
    return std_shiftRight(lhs, rhs);
}
static inline var op_infix_shiftLeft(var lhs, var rhs) {
    return std_shiftLeft(lhs, rhs);
}
static inline var op_infix_bitwiseXOR(var lhs, var rhs) {
    return std_bitwiseXOR(lhs, rhs);
}
static inline var op_infix_bitwiseAND(var lhs, var rhs) {
    return std_bitwiseAND(lhs, rhs);
}
static inline var op_infix_bitwiseOR(var lhs, var rhs) {
    return std_bitwiseOR(lhs, rhs);
}

var user_handle_http_request(var request) {
    return op_infix_plus(op_infix_plus(var_from_string("{\"randomInt\":"), std_rand()), var_from_string("}"));
}



int main() {
    var fd = std_fopen(var_from_string("/Users/altox/Desktop/test.txt"), var_from_string("r"));
    io_print(1, std_fgets(fd, var_from_int(3)));
    io_print(1, std_fgets(fd, var_from_int(3)));
}