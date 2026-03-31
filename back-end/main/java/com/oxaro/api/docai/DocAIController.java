package com.oxaro.api.docai;


import com.google.cloud.documentai.v1.*;
import com.google.protobuf.ByteString;
import com.oxaro.support.Text;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

/// ////////////////////////////////
// Google Authentication information
// API key are not accepted for DocAI API
// Service Account key are static JSON file used for authentication.
//     The env variable GOOGLE_APPLICATION_CREDENTIALS  should be pointing to the json file
//     GOOGLE_APPLICATION_CREDENTIALS can be defined in IntelliJ launch feature
//     The JSON should be downloaded from the Service Account in Google console
//     A specific path to the json can be provided to DocumentProcessorServiceSettings
//     *** At this point, the JSON file can't be created under the Oxaro policy
// Current measure
//   Use: gcloud auth application-default login
//   The browser will help to login an account to access API calls not specifying a GOOGLE_APPLICATION_CREDENTIALS local
// Cloud deployment
//   A Service Account can be accessed directly when calling the API from the cloud.





/**
 * Spring Controller to feed the global application data to React
 */
@RestController
@RequestMapping("/api/app/docai")
@Slf4j
class DocAIController {


    private final String projectId = "prj-dev-455515";
    private final String location = "us";  // Replace with the processor location (e.g., "us" or "eu")
    private final String ocrProcessorId = "d4ecab75b2a7c541";  // OCR Processor ID
    private final String formParserID = "6e37288de9108428";  // OCR Processor ID
    private final String invoiceProcessorId = "c1e0e0c20ecaa520";  // Invoice Processor ID
    private final String receiptProcessorId = "90c990446328f083";  // Invoice Processor ID
    private final String classifierProcessorId1 = "27f7b4cffb8b23ed";  // Invoice Processor ID
//    private final String classifierProcessorVersion = "740d2cfc971d851b";  // Invoice Processor ID
    private final String classifierProcessorVersion = null;  // Invoice Processor ID
    DateTimeFormatter formatter8e = DateTimeFormatter.ofPattern("MM-dd-yy");
    DateTimeFormatter formatter10e = DateTimeFormatter.ofPattern("MM-dd-yyyy");
    DateTimeFormatter formatter10 = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * gets the application information
     *
     * @return the app info dto
     */
    @GetMapping(value = "data")
    public String getAppData() {
        String data = "Hello World!";
        return "Hello from the backend!";
    }


    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadClassification2(@RequestParam("file") MultipartFile file) {
        // Check if file is empty
        Map<String, Object> result = new HashMap<>();

        getGoogleCategoryResponseEntity(file, result, classifierProcessorId1, classifierProcessorVersion);
        String documentType = (String) result.get("DocumentType");
        ArrayList tableList= new ArrayList();

        result.put("Processor",tableList);
//        documentType="Others";
        if ("Invoice".equalsIgnoreCase(documentType))
            getGoogleAPIResponseEntity(file, result, invoiceProcessorId,tableList);
        else if ("Receipt".equalsIgnoreCase(documentType))
            getGoogleAPIResponseEntity(file, result, receiptProcessorId,tableList);

        getGoogleAPIResponseEntityFormParser(file, result, formParserID,tableList);

        return new ResponseEntity<>(result, HttpStatus.OK);

    }


    private void getGoogleAPIResponseEntity(MultipartFile file, Map<String, Object> result, String processorId, ArrayList tableList) {
        // Check if file is empty

        log.debug("Processing new file: {}", file.getName());

        try {
            // Initialize Document AI client
            DocumentProcessorServiceSettings settings =
                    DocumentProcessorServiceSettings.newBuilder().build();
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!! ENV: "+   System.getenv("GOOGLE_APPLICATION_CREDENTIALS"));
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!! "+settings.getCredentialsProvider().getCredentials().getAuthenticationType());
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!! "+settings.getCredentialsProvider().getCredentials().toString());

            try (DocumentProcessorServiceClient client = DocumentProcessorServiceClient.create(settings)) {

                // Convert file to byte array
                byte[] fileBytes = file.getBytes();
                // Step 2: Convert OCR text to bytes and send to Invoice Processor
                Document invoiceDocument = processWithProcessor(client, fileBytes, processorId, null, file.getContentType());


                 invoiceDocument.getEntitiesList().stream()
                        .map(entity -> {
                            Map<String, String> entityMap = new HashMap<>();
                            entityMap.put("type", entity.getType());
                            if ("invoice_date".equalsIgnoreCase(entity.getType())) {
                                result.put("DocumentYear", parseDate(entity.getMentionText()));
                            }
                            if ("receipt_date".equalsIgnoreCase(entity.getType())) {
                                result.put("DocumentYear", parseDate(entity.getMentionText()));
                            }
                            entityMap.put("text", entity.getMentionText());
                            entityMap.put("id", entity.getMentionId());
                            entityMap.put("confidence", String.format("%.1f", entity.getConfidence()));
                            tableList.add(entityMap);
                            return entityMap;
                        })
                        .collect(Collectors.toList());

                result.put("ProcessorText", invoiceDocument.getText());

            }
        } catch (IOException e) {
            e.printStackTrace();
            result.put("ProcessorError", e.getMessage());
        }
    }

    private void getGoogleAPIResponseEntityFormParser(MultipartFile file, Map<String, Object> result, String processorId, ArrayList tableList) {
        // Check if file is empty

        log.debug("Processing new file: {}", file.getName());

        try {
            // Initialize Document AI client
            DocumentProcessorServiceSettings settings =
                    DocumentProcessorServiceSettings.newBuilder().build();
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!! ENV: "+   System.getenv("GOOGLE_APPLICATION_CREDENTIALS"));
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!! "+settings.getCredentialsProvider().getCredentials().getAuthenticationType());
            System.out.println("!!!!!!!!!!!!!!!!!!!!!!! "+settings.getCredentialsProvider().getCredentials().toString());

            try (DocumentProcessorServiceClient client = DocumentProcessorServiceClient.create(settings)) {

                // Convert file to byte array
                byte[] fileBytes = file.getBytes();
                // Step 2: Convert OCR text to bytes and send to Invoice Processor
                Document invoiceDocument = processWithProcessor(client, fileBytes, processorId, null, file.getContentType());

                assert invoiceDocument != null;
                invoiceDocument.getPagesList().forEach(page -> {
                    page.getFormFieldsList().forEach(field -> {
                        Map<String, String> entityMap = new HashMap<>();
                        String fieldName = field.getFieldName().getTextAnchor().getContent();
                        String fieldValue = field.getFieldValue().getTextAnchor().getContent();
                        System.out.printf("Field name: %s%nField value: %s%n", fieldName, fieldValue);
                        entityMap.put(fieldName, fieldValue);
                        entityMap.put("text", fieldValue);
                        entityMap.put("id", fieldName);
                        entityMap.put("type", fieldName);
                        tableList.add(entityMap);
                    });
                });



            }
        } catch (IOException e) {
            e.printStackTrace();
            result.put("ProcessorError", e.getMessage());
        }
    }

    private void getGoogleCategoryResponseEntity(MultipartFile file, Map<String, Object> result, String processorId, String processorVersion) {
        // Check if file is empty

        log.debug("Processing new file: {}", file.getName());

        try {
            // Initialize Document AI client
            DocumentProcessorServiceSettings settings =
                    DocumentProcessorServiceSettings.newBuilder().build();
            try (DocumentProcessorServiceClient client = DocumentProcessorServiceClient.create(settings)) {

                // Convert file to byte array
                byte[] fileBytes = file.getBytes();
                // Step 2: Convert OCR text to bytes and send to Invoice Processor
                Document invoiceDocument = processWithProcessor(client, fileBytes, processorId, processorVersion, file.getContentType());

                AtomicReference<Float> currentConfidence = new AtomicReference<>((float) 0);
                AtomicReference<String> documentType = new AtomicReference<>("");

                List<Map<String, String>> entities = invoiceDocument.getEntitiesList().stream()
                        .map(entity -> {
                            Map<String, String> entityMap = new HashMap<>();
                            entityMap.put("type", entity.getType());
                            entityMap.put("text", entity.getMentionText());
                            entityMap.put("id", entity.getMentionId());
                            float newConfidence = entity.getConfidence();
                            entityMap.put("confidence", String.format("%.1f", newConfidence));
                            if (newConfidence > .2 && newConfidence > currentConfidence.get()) {
                                currentConfidence.set(newConfidence);
                                documentType.set(entity.getType());
                            }
                            return entityMap;
                        })
                        .collect(Collectors.toList());

                result.put("Classifier", entities);
                result.put("DocumentType", documentType.get());
                result.put("ClassifierText", invoiceDocument.getText());

            }
        } catch (IOException e) {
            e.printStackTrace();
            result.put("ProcessorError", e.getMessage());
        }
    }


    private String parseDate(String date) {
        if (Text.isNullOrEmpty(date)) return "";
        if (date.length() == 4) return date;
        try {
            date = date.replace('/', '-');
            if (date.length() == 10 && date.charAt(4) == '-') return LocalDate.parse(date, formatter10).getYear() + "";
            String year = Text.afterLast(date, "-", true);
            if (year.length() == 2) return "20" + year;
            return year;
        } catch (Exception ignored) {
        }
        return "Error: " + date;
    }


    // Helper method to process document with a specified processor
    private Document processWithProcessor(DocumentProcessorServiceClient client, byte[] fileBytes, String processorId, String processorVersion, String mimeType) {
        try {
            // Define the processor and prepare the request
            ProcessorName processorName = ProcessorName.of(projectId, location, processorId);
            String processorNameText = processorName.toString();
            if (Text.isNotNullOrEmpty(processorVersion)) processorNameText += "/processorVersions/" + processorVersion;
            System.out.println("Reaching processor1: " + processorNameText);
            RawDocument rawDocument = RawDocument.newBuilder()
                    .setContent(ByteString.copyFrom(fileBytes))
                    .setMimeType(mimeType)
                    .build();

            ProcessRequest request = ProcessRequest.newBuilder()
                    .setName(processorNameText)
                    .setRawDocument(rawDocument)
                    .build();

            // Process the document
            ProcessResponse response = client.processDocument(request);
            return response.getDocument();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }



}


