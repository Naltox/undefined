//
// Created by Narek Abovyan on 11/09/2017.
//

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <zconf.h>
#include "var.h"

char* append(char* str, char* str_to_add) {
    int strLength = strlen(str);
    int need = strlen(str_to_add);


    //printf("%d, %d", strLength, need);

//    char newStr[strLength + need];

    //strcat(newStr, str);


    str = realloc(str, strLength + need);
    strcat(str, str_to_add);


    return str;
}

char* var2str(var v) {
    if (v.type == INTEGER_TYPE) {
        //char *str = malloc(0);

        char* str;

        asprintf(&str, "%d", v.value.i);

        //sprintf(str, "%d", v.value.i);

        return str;
    }
    if (v.type == STRING_TYPE) {
        return v.value.s;
    }
    if (v.type == BOOLEAN_TYPE) {
        if (v.value.b == true)
            return "true";
        else
            return  "false";
    }
    if (v.type == NAN_TYPE)
        return  "NaN";

    if (v.type == ARRAY_TYPE) {
        //char* str;
        //char str[1024];
        char* str = malloc(1);

        //printf("[ ");

        //asprintf(&str, "[");

        str = append(str, "[");

        //strcat(str, "[");

        //printf("%s", var2str(var_array_get(&v, 0)));



        for(int i = 0; i < v.value.ar->used; i++) {
            //printf("%s%s", var2str(var_array_get(&v, i)), i == v.value.ar->used - 1 ? "" : ", ");

            //printf("%s", var2str(var_array_get(&v, i)));
            //printf("\n");

            //asprintf(&str, "%s", var2str(var_array_get(&v, i)));

            str = append(str, var2str(var_array_get(&v, varFromInt(i))));
            str = append(str, i == v.value.ar->used - 1 ? "" : ", ");
            //strcat(str, var2str(var_array_get(&v, i)));
            //strcat(str, i == v.value.ar->used - 1 ? "" : ", ");


            //asprintf(&str, "%s",  i == v.value.ar->used - 1 ? "" : ", ");


            //strcat(str, ", ");
        }

        //strcat(str, "]");

        str = append(str, "]");

        //asprintf(&str, "]");

        return str;
    }
}

var varFromInt(int i) {
    var v;

    v.value.i = i;
    v.type = INTEGER_TYPE;

    return  v;
}

var_print(int num, ...) {
    va_list valist;

    va_start(valist, num);

    for (int i = 0; i < num; i++) {
        printf("%s", var2str(va_arg(valist, var)));

        if (i != num - 1)
            printf(", ");
    }

    printf("\n");

    va_end(valist);
}
