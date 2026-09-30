import time
import numpy as np
from typing import Dict, Any, Tuple
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

class ClassicalMLService:
    """
    Classical Machine Learning Service:
    - Trains baseline classifiers (Random Forest, SVM)
    - Records actual execution wall-clock time
    - Calculates genuine scientific metrics from real test splits
    """

    def __init__(self, test_size: float = 0.20, random_state: int = 42):
        self.test_size = test_size
        self.random_state = random_state

    def split_data(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        return train_test_split(
            X, y, 
            test_size=self.test_size, 
            random_state=self.random_state, 
            stratify=y
        )

    def train_and_evaluate(
        self, 
        model_name: str, 
        X_train: np.ndarray, 
        X_test: np.ndarray, 
        y_train: np.ndarray, 
        y_test: np.ndarray
    ) -> Tuple[Dict[str, Any], Any]:
        
        if model_name == "svm":
            model = SVC(kernel="rbf", C=1.0, probability=True, random_state=self.random_state)
        else: # default: random_forest
            model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=self.random_state)

        # 1. Train model with timing
        t0 = time.time()
        model.fit(X_train, y_train)
        training_time_sec = float(time.time() - t0)

        # 2. Evaluate model with timing
        t1 = time.time()
        y_pred = model.predict(X_test)
        inference_total_time = time.time() - t1
        inference_time_ms = float((inference_total_time / max(len(X_test), 1)) * 1000.0)

        # 3. Calculate genuine metrics
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
        rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
        cm = confusion_matrix(y_test, y_pred).tolist()

        metrics = {
            "accuracy": round(acc * 100.0, 2),
            "precision": round(prec, 3),
            "recall": round(rec, 3),
            "f1Score": round(f1, 3),
            "confusionMatrix": cm,
            "trainingTimeSec": round(training_time_sec, 3),
            "inferenceTimeMs": round(inference_time_ms, 2),
            "testSamplesCount": int(len(y_test))
        }

        return metrics, model
