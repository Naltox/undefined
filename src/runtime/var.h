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
    NAN_TYPE,
    POINTER_TYPE
};

//typedef struct var_pointer {
//    void* pointer;
//    int type;
//};

typedef struct var {
    enum var_type type;
    int extra;

    union {
        bool b;
        int i;
        double f;
        void* s;//string
        void* a;//array <var>
        void* o;//object
        void* p;//pointer
    } value;
} var;

char* var2str(var v);

inline var var_from_bool(bool b);

inline var var_from_int(int i);

inline var var_from_float(double f);

inline var var_from_string(char *str);

inline var var_from_pointer(void* p, int type);

inline var var_nan();

inline var var_null();

inline bool var_is_true(var v);

inline bool var2bool(var v);

#endif //C_TESTS_VAR_H
