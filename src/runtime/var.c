//
// Created by Narek Abovyan on 11/09/2017.
//

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "var.h"

char* append(char* str, char* str_to_add) {
    const size_t strLength = strlen(str);
    const size_t need = strlen(str_to_add);

    const size_t total = strLength + need + 1;

    printf("str: %s, toAdd: %s, strL: %d, need: %d\n", str, str_to_add, strLength, need);


    //str = realloc(str, sizeof(size_t) * strLength + sizeof(size_t) * need);
    str = realloc(str, total);
    //strcat(str, str_to_add);

    memcpy(str + strLength, str_to_add, need + 1);



    return str;
}

char* var2str(var v) {
    if (v.type == INTEGER_TYPE) {
        char* str;

        asprintf(&str, "%d", v.value.i);

        return str;
    }
    if (v.type == FLOAT_TYPE) {
        char* str;

        asprintf(&str, "%.17f", v.value.f);

        return str;
    }
    if (v.type == STRING_TYPE) {
        return v.value.s;
    }
    if (v.type == BOOLEAN_TYPE) {
        if (v.value.b == true)
            return "true";
        else
            return "false";
    }
    if (v.type == NAN_TYPE)
        return  "NaN";

    if (v.type == ARRAY_TYPE) {
        char* str = calloc(1, sizeof(char));

        printf("addr: %d\n", str);

        str = append(str, "[");

        var_array* ar = v.value.a;

        for(int i = 0; i < ar->used; i++) {
            var item = var_array_get(&v, var_from_int(i));

            str = append(str, var2str(item));
            str = append(str, i == ar->used - 1 ? "" : ", ");
        }

        str = append(str, "]");

        return str;
    }
}

extern inline var var_from_bool(bool b) {
    var v;

    v.value.b = b;
    v.type = BOOLEAN_TYPE;

    return  v;
}

extern inline var var_from_int(int i) {
    var v;

    v.value.i = i;
    v.type = INTEGER_TYPE;

    return  v;
}

extern inline var var_from_float(double f) {
    var v;

    v.value.f = f;
    v.type = FLOAT_TYPE;

    return v;
}

extern inline var var_from_string(char *str) {
    var v;

    v.value.s = str;
    v.type = STRING_TYPE;

    return  v;
}

extern inline var var_from_pointer(void* p, int type) {
    var v;

    v.value.p = p;
    v.extra = type;
    v.type = POINTER_TYPE;

    return  v;
}

extern inline var var_nan() {
    var v;

    v.type = NAN_TYPE;

    return  v;
}

extern inline var var_null() {
    var v;

    v.type = NULL_TYPE;

    return  v;
}

extern inline bool var_is_true(var v) {
    if (v.type == INTEGER_TYPE) {
        return v.value.i > 0;
    }

    if (v.type == BOOLEAN_TYPE) {
        return v.value.b;
    }

    return false;
}

extern inline bool var2bool(var v) {
    if (v.type == BOOLEAN_TYPE)
        return v.value.b;

    if (v.type == INTEGER_TYPE)
        return v.value.i > 0;

    if (v.type == STRING_TYPE)
        return true;

    return false;
}
