//
// Created by Narek Abovyan on 11/09/2017.
//

#include <stdlib.h>
#include <printf.h>
#include "var_array.h"
#include "var.h"


//void var_array_init(var_array* a) {
//    a->array = (var* )malloc(100 * sizeof(var));
//    a->used = 0;
//    a->size = 100;
//}

var var_array_init(var* v) {
    v->value.ar->array = (var* )malloc(100 * sizeof(var));
    v->value.ar->used = 0;
    v->value.ar->size = 100;
}

var var_array_new(struct var* vars) {
    var arr;



    int length = sizeof(vars) / sizeof(var);
    printf("%d", sizeof(&vars));

//    int length = sizeof(vars) / sizeof(var);
//
//    printf("%d", length);
//
//    arr.value.ar->array = vars;
//    arr.value.ar->used = length;
//    arr.value.ar->size = length + 100;
//
//    arr.type = ARRAY_TYPE;


    return  arr;
}

void var_array_push(struct var* v, var value){
    if (v->type != ARRAY_TYPE) {
        printf("%s is not an array", var2str(*v));
        exit(1);
    }

    if (v->value.ar->used == v->value.ar->size) {
        v->value.ar->size *= 1.5;
        v->value.ar->array = (var *)realloc(v->value.ar->array, v->value.ar->size * sizeof(var));
    }
    v->value.ar->array[v->value.ar->used++] = value;
}

var var_array_get(struct var* v, var index) {
    if (v->type != ARRAY_TYPE) {
        printf("%s is not an array", var2str(*v));
        exit(1);
    }

    if (index.value.i > v->value.ar->used) {
        printf("No such index %s in array %s", var2str(index), var2str(*v));
        exit(1);
    }
    return  v->value.ar->array[index.value.i];
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

    array.value.ar = arr;
    array.type = ARRAY_TYPE;

    var_array_init(&array);

    va_start(valist, num);

    for (int i = 0; i < num; i++) {
        var_array_push(&array, va_arg(valist, var));
    }

    va_end(valist);

    return array;
}

//void var_array_print(struct var* v) {
//    printf("[ ");
//    for(int i = 0; i < v->value.ar->used; i++) {
//        printf("%s%s", var2str(var_array_get(v, varFromInt(i))), i == v->value.ar->used - 1 ? "" : ", ");
//    }
//    printf(" ]");
//}