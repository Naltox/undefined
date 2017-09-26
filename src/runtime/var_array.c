//
// Created by Narek Abovyan on 11/09/2017.
//

#include <stdlib.h>
#include <printf.h>
#include "var_array.h"
#include "var.h"


void var_array_init(var* v) {
    var_array* ar = v->value.a;

    ar->array = (var*)malloc(100 * sizeof(var));
    ar->used = 0;
    ar->size = 100;
}

void var_array_push(struct var* v, var value){
    if (v->type != ARRAY_TYPE) {
        printf("%s is not an array", var2str(*v));
        exit(1);
    }

    var_array* ar = v->value.a;

    if (ar->used == ar->size) {
        ar->size *= 1.5;
        ar->array = (var *)realloc(ar->array, ar->size * sizeof(var));
    }

    ar->array[ar->used++] = value;
}

struct var var_array_pop(struct var* v) {
    if (v->type != ARRAY_TYPE) {
        printf("%s is not an array", var2str(*v));
        exit(1);
    }

    var_array* ar = v->value.a;

    ar->used = ar->used - 1;

    return ar->array[ar->used];
}

struct var var_array_length(struct var* v) {
    var_array* ar = v->value.a;

    return var_from_int(ar->used);
}

var var_array_get(struct var* v, var index) {
    if (v->type != ARRAY_TYPE) {
        printf("%s is not an array", var2str(*v));
        exit(1);
    }

    var_array* ar = v->value.a;

    if (index.value.i > ar->used) {
        printf("No such index %s in array %s", var2str(index), var2str(*v));
        exit(1);
    }

    return ar->array[index.value.i];
}

var var_array_get_recursive(struct var* v, int num, ...) {
    va_list valist;

    va_start(valist, num);

    var currentVar = var_array_get(v, va_arg(valist, var));

    for (int i = 0; i < num - 1; i++) {
        var index = va_arg(valist, var);

        currentVar = var_array_get(&currentVar, index);
    }

    va_end(valist);

    return currentVar;
}

struct var var_array_create_inline(int num, ...) {
    va_list valist;
    var array;

    var_array* arr = malloc(sizeof(var_array));

    array.value.a = arr;
    array.type = ARRAY_TYPE;

    var_array_init(&array);

    va_start(valist, num);

    for (int i = 0; i < num; i++) {
        var_array_push(&array, va_arg(valist, var));
    }

    va_end(valist);

    return array;
}