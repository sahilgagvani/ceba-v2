package com.oxaro.support;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Locale;
import java.util.TimeZone;

/**
 * This class contains generic help methods to manipulate date and text available throughout the application
 */
public class Text {

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Date parsing
    ///////////////////////////////////////////////////////////////////////////////////////
    // Amanda standard time format 2015-12-02T06:00:00.000Z
    public static final DateTimeFormatter dateParser8 = DateTimeFormatter.ofPattern("yyyyMMdd");
    public static final DateTimeFormatter dateParser10 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter dateParser16 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    public static final DateTimeFormatter dateParser19 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter dateParser23 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    static final DecimalFormat numberFormat = new DecimalFormat("0.0");


    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Number parsing
    ///////////////////////////////////////////////////////////////////////////////////////
    static final NumberFormat format_en = NumberFormat.getInstance(Locale.CANADA);
    static final NumberFormat format_fr = NumberFormat.getInstance(Locale.CANADA_FRENCH);

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// trim
    ///////////////////////////////////////////////////////////////////////////////////////
    public static String trim(String text) {
        return trim(text, ' ');
    }

    public static String trim(String text, char character) {
        return trimStart(trimEnd(text, character), character);
    }

    public static String trimStart(String text, char character) {
        if (text == null) return "";
        int i = 0;
        while (i < text.length() && text.charAt(i) == character) i++;
        return text.substring(i);
    }


    public static String trimEnd(String text, char character) {
        if (text == null) return "";
        int i = 0;
        while (i < text.length() && text.charAt(text.length() - i - 1) == character) i++;
        return text.substring(0, text.length() - i);
    }

    public static String ellipsis(String text, int maxLength) {
        if (text == null) return "";
        if (text.length() > maxLength) return text.substring(0, maxLength) + "...";
        return text;
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Path
    ///////////////////////////////////////////////////////////////////////////////////////
    public static String combinePaths(String path1, String path2) {
        if (isNullOrEmpty(path2)) return path1;
        if (isNullOrEmpty(path1)) return path2;

        if (!path1.endsWith("/")) path1 = path1 + "/";
        path2 = trimStart(path2, '/');
        return path1 + path2;
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Before / After
    ///////////////////////////////////////////////////////////////////////////////////////
    public static String beforeFirst(String text, String what) {
        return beforeFirst(text, what, true);
    }

    public static String beforeFirst(String text, String what, boolean forceReturn) {
        if (text != null) {
            int pos = text.indexOf(what);
            if (pos >= 0) return text.substring(0, pos);
            else if (forceReturn) return text;
        }
        return "";
    }

    public static String beforeLast(String text, String what) {
        return beforeLast(text, what, true);
    }

    public static String beforeLast(String text, String what, boolean forceReturn) {
        if (text != null) {
            int pos = text.lastIndexOf(what);
            if (pos >= 0) return text.substring(0, pos);
            else if (forceReturn) return text;
        }
        return "";
    }

    public static String afterFirst(String text, String what) {
        return afterFirst(text, what, false);
    }

    public static String afterFirst(String text, String what, boolean forceReturn) {
        // Return the string before the element
        if (text != null) {
            int pos = text.indexOf(what);
            if (pos >= 0) return text.substring(pos + what.length());
            else if (forceReturn) return text;
        }
        return "";
    }

    public static String afterLast(String text, String what) {
        return afterLast(text, what, false);
    }

    public static String afterLast(String text, String what, boolean forceReturn) {
        // Return the string after the element
        if (text != null) {
            int pos = text.lastIndexOf(what);
            if (pos >= 0) return text.substring(pos + what.length());
            else if (forceReturn) return text;
        }
        return "";
    }


    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Exceptions
    ///////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Null / Equals
    ///////////////////////////////////////////////////////////////////////////////////////
    public static boolean isNullOrEmpty(String text) {
        if (text == null) return true;
        return text.isEmpty();
    }

    public static boolean isNotNullOrEmpty(String text) {
        return !isNullOrEmpty(text);
    }

    public static boolean isEqual(Object text1, Object text2) {
        if (text1 == null && text2 == null) return true;
        if (text1 == null) return false;
        if (text2 == null) return false;
        return text1.equals(text2.toString());
    }

    public static boolean isNotEquals(String s1, String s2) {
        return !isEqual(s1, s2);
    }

    public static <T> boolean isListNullOrEmpty(ArrayList<T> array) {
        return (array == null || array.isEmpty());
    }

    public static <T> boolean isListNotNullOrEmpty(ArrayList<T> array) {
        return !isListNullOrEmpty(array);
    }

    public static String escapeStringForHTML(String text) {
        if (text == null) return null;
        if (!text.contains("&")) return text.trim();

        text = text.replace("&#10;", "\n");
        text = text.replace("&#13;", "");

        text = text.replace("&gt;", ">");
        text = text.replace("&#lst;", "<");
        text = text.replace("&quot;", "\"");
        text = text.replace("&apos;", "'");
        text = text.replace("&amp;", "&");
        text = text.replace("&nbsp;", "\u00A0");

        return text.trim();
    }

    public static String getExceptionDetails(Throwable ex) {
        return getExceptionDetails(ex, 4);
    }

    public static String getExceptionDetails(Throwable ex, int minDepth) {
        if (ex == null) return "";
        StringBuilder sb = new StringBuilder();
        sb.append("[").append(ex.getClass()).append("] ");
        getExceptionMessageRecursively(sb, ex);
        StackTraceElement[] traces = ex.getStackTrace();
        for (int i = 0; i < traces.length; i++) {
            String line = traces[i].toString();
            String firstChar = line.substring(0, 1); // Looking for an upper case as those means important custom classes
            if (i <= minDepth || firstChar.equals(firstChar.toUpperCase()))
                sb.append("   at ").append(traces[i]).append("\n");
        }

        return Text.trimEnd(sb.toString(), '\n');
    }

    static void getExceptionMessageRecursively(StringBuilder sb, Throwable ex) {
        if (ex == null) return;
        if (Text.isNotNullOrEmpty(ex.getMessage()))
            sb.append(ex.getClass().getName()).append(": ").append(ex.getMessage()).append("\n");
        getExceptionMessageRecursively(sb, ex.getCause());
    }

    static String getExceptionShortTrace(Throwable ex) {
        StringBuilder result = new StringBuilder();
        for (StackTraceElement el : ex.getStackTrace()) {
            if (Text.isNullOrEmpty(el.getClassName())
                    || !el.getClassName().toLowerCase().startsWith("com.oxaro")) continue;
            result.append(" (").append(Text.beforeLast(el.getFileName(), ".")).append(".").append(el.getMethodName()).append(" Line:").append(el.getLineNumber()).append(")");
        }
        return result.toString();
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Numbers
    ///////////////////////////////////////////////////////////////////////////////////////
    public static boolean isInteger(String strNum) {
        if (isNullOrEmpty(strNum)) return false;
        if (!(Character.isDigit(strNum.charAt(0)) || strNum.charAt(0) == '-')) return false;
        try {
            Integer.parseInt(strNum);
            return true;
        } catch (Exception e) {
            return false;
        }

    }

    public static String formatDate8(LocalDateTime date) {
        if (date == null) return "";
        return dateParser8.format(date);
    }

    public static String formatDate10(LocalDateTime date) {
        if (date == null) return "";
        return dateParser10.format(date);
    }

    public static String formatDate10(LocalDate date) {
        if (date == null) return "";
        return dateParser10.format(date);
    }


    public static String formatDate19(LocalDateTime date) {
        if (date == null) return "";
        return dateParser19.format(date);
    }

    public static String formatDate16(LocalDateTime date) {
        if (date == null) return "";
        return dateParser16.format(date);
    }

    public static String formatDate19(long date) {
        return formatDate19(LocalDateTime.ofInstant(Instant.ofEpochMilli(date), TimeZone.getDefault().toZoneId()));

    }

    public static String formatDate23(LocalDateTime date) {
        if (date == null) return "";
        return dateParser23.format(date);
    }


    public static String getDuration(LocalDateTime startTime) {
        long diff = Duration.between(startTime, LocalDateTime.now()).toMillis();
        if (diff < 1000) return diff + "ms";
        double sec = diff / 1000.0;
        return numberFormat.format(sec) + "s";
    }

    public static double parseDouble(boolean isFrench, String value) throws ParseException {
        if (Text.isNullOrEmpty(value)) return 0;
        NumberFormat format = format_en;
        if (isFrench) format = format_fr;
        return format.parse(value).doubleValue();
    }

    public static double parseDouble(boolean isFrench, String value, int digitToKeep) throws ParseException {
        if (Text.isNullOrEmpty(value)) return 0;
        double factor = Math.pow(10, digitToKeep);
        NumberFormat format = format_en;
        if (isFrench) format = format_fr;
        return Math.round(format.parse(value).doubleValue() * factor) / factor;
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Base64
    ///////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// File operations
    ///////////////////////////////////////////////////////////////////////////////////////
    public static String readTextFile(String path) throws Exception {
        byte[] encoded = readFile(path);
        return new String(encoded, StandardCharsets.UTF_8);
    }


    public static byte[] readFile(String path) throws Exception {
        return Files.readAllBytes(Paths.get(path));
    }

    public static void writeFile(String path, byte[] data) throws Exception {
        createDirectoriesFromFile(path);
        Files.write(Paths.get(path), data, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }

    public static void writeTextFile(String path, String data) throws Exception {
        createDirectoriesFromFile(path);
        Files.write(Paths.get(path), data.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }


    public static void appendTextFile(String path, String text) throws Exception {
        createDirectoriesFromFile(path);
        Files.write(Paths.get(path), text.getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    public static void createDirectoriesFromFile(String path) throws IOException {
        Path p = Paths.get(path);
        p = p.getParent();
        Files.createDirectories(p);
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// IsOneOfCodes
    ///////////////////////////////////////////////////////////////////////////////////////
    public static boolean isOneOfCodes(int code, String codes) {
        return isOneOfCodes(String.valueOf(code), codes);
    }

    public static boolean isOneOfCodes(String code, String codes) {
        code = "," + code + ",";
        codes = "," + codes + ",";
        return codes.contains(code);
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////// Cast
    ///////////////////////////////////////////////////////////////////////////////////////
    // Equivalent to the .Net as
    public static <T> T as(Class<T> t, Object o) {
        return t.isInstance(o) ? t.cast(o) : null;
    }

    public static String getAsString(Object o) {
        if (o == null) return "";
        return o.toString();
    }

}