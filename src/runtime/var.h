//
// Created by Narek Abovyan on 11/09/2017.
//

#ifndef C_TESTS_VAR_H
#define C_TESTS_VAR_H

#include <stdbool.h>
#include "var_array.h"

enum var_type {
    NULL_TYPE,
    BOOLEAN_TYPE,
    INTEGER_TYPE,
    FLOAT_TYPE,
    STRING_TYPE,
    ARRAY_TYPE,
    OBJECT_TYPE,
    NAN_TYPE
};



typedef struct var {
    enum var_type type;

    union {
        bool b;
        int i;
        double f;
        void* s;//string
        void* a;//array <var>
        struct var_array* ar;//array <var>
        void* o;//object
    } value;
} var;

char* var2str(var v);

var varFromInt(int i);

var_print(int num, ...);

#endif //C_TESTS_VAR_H
