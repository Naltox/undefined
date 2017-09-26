//
// Created by Narek Abovyan on 11/09/2017.
//

#ifndef C_TESTS_VAR_ARRAY_H
#define C_TESTS_VAR_ARRAY_H

#include "var.h"

typedef struct var_array {
    struct var* array;
    int used;
    int size;
} var_array;


void var_array_init(struct var* v);

void var_array_push(struct var* v, struct var value);

struct var var_array_pop(struct var* v);

struct var var_array_length(struct var* v);

struct var var_array_get(struct var* v, struct var index);

struct var var_array_get_recursive(struct var* v, int num, ...);

struct var var_array_create_inline(int num, ...);


#endif //C_TESTS_VAR_ARRAY_H
